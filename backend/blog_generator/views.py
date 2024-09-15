from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pytubefix import YouTube
from django.conf import settings
from dotenv import load_dotenv
from django.contrib.auth.models import User
from .models import BlogPost
import assemblyai as aai
import cohere
import os
import json
import markdown

load_dotenv()

@csrf_exempt
def create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            yt_link = data['link']
        except(KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Invalid Data'}, status=405)
        
        title = yt_title(yt_link)
        audio_file = download_audio(yt_link)
        transcript = generate_transcrpit(audio_file)

        if not transcript:
            return JsonResponse({'error': 'Failed to generate transcript'}, status=501)

        new_transcript = trim_transcript(transcript)
        ai_generated_blog = generate_blog_from_transcript(new_transcript)

        if not ai_generated_blog:
            return JsonResponse({'error': 'Failed to Generate Blog content'}, status=501)

        new_blog_article = BlogPost.objects.create(
            user=User.objects.get(id=1),
            youtube_title=title,
            youtube_link=yt_link,
            transcript=transcript,
            generated_blog_content=ai_generated_blog
        )

        html_parsed_blog_content = markdown.markdown(new_blog_article.generated_blog_content)

        return JsonResponse({'blogContent': html_parsed_blog_content})
    else:
        return JsonResponse({'error': 'Invalid request method'}, {'data': request}, status=405)
    
def yt_title(link):
    yt = YouTube(link)
    title = yt.title
    return title

def download_audio(link):
    yt = YouTube(link)
    video = yt.streams.filter(only_audio=True).first()
    out_file = video.download(output_path=settings.MEDIA_ROOT)
    base, ext = os.path.splitext(out_file)
    new_file = base + '.mp3'

    count = 1
    while os.path.exists(new_file):
        new_file = f"{base}({count}).mp3"
        count += 1
    os.rename(out_file, new_file)
    return new_file

def generate_transcrpit(audio_file):
    aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio_file)

    return transcript.text

def trim_transcript(transcript):
    words = transcript.split()
    trimmed_words = words[:500]
    trimmed_transcript = ' '.join(trimmed_words)
    
    return trimmed_transcript

def generate_blog_from_transcript(transcript):
    cohere_api_key = os.getenv("COHERE_API_KEY")
    cohere_client = cohere.Client(cohere_api_key)

    prompt = f'Create a clear, engaging blog from this transcript:\n\n{transcript}\n\nBlog:'

    response = cohere_client.generate(
        model='command-nightly',
        prompt=prompt,
        max_tokens=1000,
    )

    generated_blog = response.generations[0].text.strip()

    return generated_blog