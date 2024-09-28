from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from pytubefix import YouTube
from django.conf import settings
from django import forms
from dotenv import load_dotenv
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import BlogPost
from . import validators
from . import urls
import assemblyai as aai
import cohere
import os
import json
import markdown

load_dotenv()

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create(request):
    try:
        if request.method == 'POST':
            try:
                data = json.loads(request.body)

                yt_link = data['link']
            except(KeyError, json.JSONDecodeError):
                return JsonResponse({'error': 'Invalid Data'}, status=400)

            if not yt_link:
                return JsonResponse({'error': 'Link Required'}, status=400)

            title = yt_title(yt_link)
            print(title)
            audio_file = download_audio(yt_link)
            print(audio_file)
            transcript = generate_transcrpit(audio_file)
            print(transcript)

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
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt 
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            username = str(data['username'])
            password = str(data['password'])
        except(KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Invalid Data'}, status=405)

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)

        try:
            user = authenticate(request, username=username, password=password)
        except(KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Unable to Authenticate./n Please check credentials'}, status=405)

        if user is None:
            return JsonResponse({'error': 'Invalid credentials'}, status=405)

        login(request, user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        return JsonResponse({'success': {'access': access_token, 'refresh': refresh_token}}, status=200)

    else:
        return JsonResponse({'error': 'Invalid Method'}, status=405)

@csrf_exempt 
def user_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            firstname = str(data['firstName'])
            lastname = str(data['lastName'])
            email = str(data['email'])
            username = str(data['username'])
            password = str(data['password'])
        except(KeyError, json.JSONDecodeError):
            return JsonResponse({'error': 'Invalid Data'}, status=405)

        if not firstname or not lastname or not email or not username or not password:
            return JsonResponse({'error': 'Required details are missing'}, status=400)

        new_user_signup = User(
            first_name=firstname,
            last_name=lastname,
            email=email,
            username=username,
        )

        new_user_signup.set_password(password)
        new_user_signup.save()

        if not new_user_signup:
            return JsonResponse({'error': 'User cannot be created'}, status=405)
        
        return JsonResponse({'message': 'Signup successful./nPlease login'}, status=200)

    else:
        return JsonResponse({'error': 'Invalid Method'}, status=405)

def yt_title(link):
    yt = YouTube(link)
    title = yt.title
    return title

def download_audio(link):
    yt = YouTube(link)
    age_check = yt.streams()
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
