from rest_framework import serializers
from .models import Property, PropertyImage, Booking
from users.models import CustomUser

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'is_listing_image', 'created_at']

class PropertySerializer(serializers.ModelSerializer):
    property_images = PropertyImageSerializer(many=True, read_only=True)
    listing_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'price_per_night', 'location', 'host', 'created_at', 'property_images', 'listing_image']

    def get_listing_image(self, obj):
        # Get the image marked as the listing image
        listing_image = obj.get_listing_image()
        return listing_image.image.url if listing_image else None
# serializers.py

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  # Add fields you want to include

class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)
    renter = UserSerializer(read_only=True)
    property = PropertySerializer(read_only=True)
    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), write_only=True, source='property'
    )

    class Meta:
        model = Booking
        fields = ['id', 'property', 'property_id', 'renter', 'check_in', 'check_out', 'user_email', 'status']

    def create(self, validated_data):
        # Fetch the user by email
        user_email = validated_data.pop('user_email')
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exist.')

        # Create and return the booking
        booking = Booking.objects.create(renter=user, **validated_data)
        return booking
