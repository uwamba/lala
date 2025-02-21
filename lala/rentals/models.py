from django.db import models
from django.conf import settings

class Property(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

    def get_listing_image(self):
        # Get the first image marked as the listing image
        return self.property_images.filter(is_listing_image=True).first()

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='property_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_images/')
    is_listing_image = models.BooleanField(default=False)  # Mark if it's the listing image
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('canceled', 'Canceled'),
    ]

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    renter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.renter.username} - {self.property.title} ({self.check_in} to {self.check_out})"
