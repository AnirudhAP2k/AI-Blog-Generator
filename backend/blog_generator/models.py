from django.db import models
from django.contrib.auth.models import User

class BlogPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    youtube_title = models.CharField(max_length=300)
    youtube_link = models.URLField()
    transcript = models.TextField()
    generated_blog_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) 

    def __id__(self):
        return str(self.id) 
