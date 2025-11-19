from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django .contrib.auth.models import AbstractUser



class User(AbstractUser):
    pass

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    CATEGORY=(('Bussiness','Bussiness'),
              ('Personal','Personal'),
              ('Important','Important'),
              )
    title=models.CharField(max_length=100)
    body=models.TextField()
    slug=models.SlugField(unique=True,blank=True,null=True)

    category=models.CharField(max_length=15,choices=CATEGORY,default='Personal')
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
    def save(self, *args, **kwargs): 
        if not self.slug:
            slug_base = slugify(self.title)
            slug = slug_base
            # Ensure slug is unique, especially when using create() which might not set the title first
            if Note.objects.filter(slug=slug).exists(): 
                # Use a while loop for robust uniqueness, though the if is usually sufficient
                while Note.objects.filter(slug=slug).exists():
                    slug = f'{slug_base}-{get_random_string(5)}'
            self.slug = slug
            
        # 👇 Pass all arguments up to the parent method
        super().save(*args, **kwargs)