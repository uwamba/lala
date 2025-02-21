import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rentals.models import Property, PropertyImage,Booking
from .serializers import PropertySerializer,BookingSerializer
import json
from django.http import JsonResponse
from social_django.utils import psa
from django.contrib.auth import get_user_model
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from django.conf import settings
from django.contrib.auth.models import User
from google.auth.exceptions import GoogleAuthError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
import jwt
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import BookingSerializer
from .permissions import IsHostUser  # Import the custom permission




@api_view(['GET'])
def property_list(request):
    """
    List all properties.
    """
    properties = Property.objects.all()
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_property(request):
    """
    Add a new property to the list.
    """
    if request.method == 'POST':
        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)  # Assign the logged-in user as the host
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def property_create(request):
    """
    Create a new property with multiple images.
    """
    if request.method == 'POST':
        # Deserialize property data
        serializer = PropertySerializer(data=request.data)
        
        if serializer.is_valid():
            property_instance = serializer.save()  # Save the property instance

            # Handle uploaded images
            images = request.FILES.getlist('images')  # 'images' is the field name from the frontend
            for img in images:
                PropertyImage.objects.create(property=property_instance, image=img)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from datetime import datetime
from users.models import CustomUser
@api_view(['POST'])

def add_booking(request):
    """
    Add a booking to the system.
    """
    if request.method == 'POST':
        check_in = request.data.get('check_in')
        check_out = request.data.get('check_out')
        property_id = request.data.get('property_id')
        email = request.data.get('user_email')  # Extract email from the request
        

        # Check if required fields are provided
        if not property_id or not check_in or not check_out or not email:
            return Response({'status': 'error','message': 'Missing required fields: property, check_in, check_out, email.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the property by ID
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'status': 'error','message':  'Property not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Convert check-in and check-out to date objects if needed
        try:
            check_in_date = datetime.strptime(check_in, "%Y-%m-%d").date()
            check_out_date = datetime.strptime(check_out, "%Y-%m-%d").date()
        except ValueError:
            return Response({'status': 'error','message': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that check-in is before check-out
        if check_in_date >= check_out_date:
            return Response({'status': 'error','message':  'Check-in date must be before check-out date.'}, status=status.HTTP_400_BAD_REQUEST)

        
        # Check if there is an existing booking for the same property on the same dates
        existing_booking = Booking.objects.filter(
            property=property,
            status='confirmed'
        ).filter(
            check_in=check_in_date,  # Exact match for check-in date
            check_out=check_out_date  # Exact match for check-out date
        ).exists()
        print('check_in:', check_in, 'check_out:', check_out, 'property_id:', property_id)
        if existing_booking:
            return Response({'status': 'error','message': 'The property is already booked for the selected dates.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check for overlapping bookings (Confirmed or Pending) for the same user
        user = CustomUser.objects.get(email=email)  # Get user by email

        overlapping_pending_booking = Booking.objects.filter(
            property=property,
            renter=user,  # Ensure it's the same user
            status='pending'
        ).filter(
            check_in__lt=check_out_date,  # New check-in is before an existing check-out
            check_out__gt=check_in_date   # New check-out is after an existing check-in
        ).exists()

        if overlapping_pending_booking:
            return Response({'status': 'error','message': 'You already have a pending booking for this property during the selected dates.'}, status=status.HTTP_400_BAD_REQUEST)
        # Check for overlapping bookings (Overlapping date range)
        overlapping_booking = Booking.objects.filter(
            property=property,
            status='confirmed'
        ).filter(
            check_in__lt=check_out_date,  # Existing check-in is before the new check-out
            check_out__gt=check_in_date   # Existing check-out is after the new check-in
        ).exists()

        if overlapping_booking:
            return Response({'status': 'error','message': 'The property is already booked for the selected dates.'}, status=status.HTTP_400_BAD_REQUEST)

        # If no overlaps, proceed with booking creation
        booking_data = {
            'property_id': property.id,
            'check_in': check_in_date,
            'check_out': check_out_date,
            'user_email': email  # Send email instead of user ID
        }
       
        serializer = BookingSerializer(data=booking_data)
        
        if serializer.is_valid():
            serializer.save()
            print('Serializer errors:', serializer.errors)
            return Response({'status': 'success', 'message': 'Booking request submitted.', 'booking': serializer.data}, status=status.HTTP_201_CREATED)

        
        return Response({'status': 'error', 'message': 'Invalid booking data.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



def verify_token(request):
    if request.method == 'POST':
        # Get the token from the frontend
        data = json.loads(request.body)
        token = data.get('token')

        try:
            # Verify the token with Google's servers
            idinfo = id_token.verify_oauth2_token(
                token,
                Request(),
                settings.GOOGLE_CLIENT_ID  # This is your Google Client ID
            )

            # Token is valid, retrieve user details
            user_info = {
                'name': idinfo.get('name'),
                'email': idinfo.get('email'),
                'picture': idinfo.get('picture'),
            }

            # Check if the user already exists or create a new user
            user, created = User.objects.get_or_create(username=idinfo['email'])
            if created:
                user.email = idinfo['email']
                user.first_name = idinfo.get('given_name', '')
                user.last_name = idinfo.get('family_name', '')
                user.save()
                
            auth_token = generate_jwt(user)

            # Return user details
            return JsonResponse({
                'status': 'success',
                'user_info': user_info,
            })

        except ValueError as e:
            # Invalid token
            return JsonResponse({'status': 'error', 'message': 'Invalid token'}, status=400)

        except GoogleAuthError as e:
            # Handle any Google Auth errors
            return JsonResponse({'status': 'error', 'message': f'Google Authentication failed: {str(e)}'}, status=400)




GOOGLE_CLIENT_ID = setting.client



User = get_user_model()
@csrf_exempt
def google_auth(request):
    if request.method == "POST":
       
        try:
            data = json.loads(request.body)
            token = data.get("token")

            # Verify the token with Google
            id_info = id_token.verify_oauth2_token(token, Request(), GOOGLE_CLIENT_ID)
            
            if "email" not in id_info:
                return JsonResponse({"error": "Invalid token"}, status=400)

            # Extract user info
            email = id_info["email"]
            name = id_info.get("name", "")
            picture = id_info.get("picture", "")

            # Save user in the database or retrieve existing one
            user, created = User.objects.get_or_create(
                username=email, 
                defaults={"email": email, "first_name": name}
            )
            
            # Ensure role field exists (assuming CustomUser model has a 'role' field)
            role = getattr(user, "role", "renter")  # Default to 'renter' if role doesn't exist

            return JsonResponse({
                "message": "User authenticated",
                "user": {
                    "email": email,
                    "name": name,
                    "role": role  # Include user role
                }
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

def generate_jwt(user):
    # Set expiration time (e.g., 1 hour)
    exp_time = timedelta(hours=1)

    # JWT payload
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + exp_time
    }

    # Encode JWT token (using your secret key)
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return token

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Property

def get_property(request, property_id):
    """Retrieve property details"""
    if request.method == "GET":
        property_obj = get_object_or_404(Property, pk=property_id)
        return JsonResponse({
            "id": property_obj.id,
            "title": property_obj.title,
            "description": property_obj.description,
            "price_per_night": property_obj.price_per_night,
            "location": property_obj.location
        })

@csrf_exempt
@api_view(['PUT', 'PATCH'])
def update_property(request, property_id):
    """
    Update an existing property, allowing new images to be added.
    """
    property_instance = get_object_or_404(Property, id=property_id)
    
    # Deserialize property data
    serializer = PropertySerializer(property_instance, data=request.data, partial=True)
    
    if serializer.is_valid():
        property_instance = serializer.save()  # Save updated property details

        # Handle new images if provided
        if 'images' in request.FILES:
            images = request.FILES.getlist('images')
            for img in images:
                PropertyImage.objects.create(property=property_instance, image=img)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
def booking_list(request):
    """
    Retrieve all bookings. If the user is a renter, show only their bookings.
    If an admin, show all bookings.
    """
    bookings = Booking.objects.all()
   
    serializer = BookingSerializer(bookings, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT', 'PATCH'])
def update_booking_status(request, booking_id):

    booking = get_object_or_404(Booking, id=booking_id)
    status_update = request.data.get('status')
    print('status::' , status_update)
    if status_update not in ['confirmed', 'canceled']:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    booking.status = status_update
    booking.save()
    return Response({"message": f"Booking {status_update}"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_booking(request, booking_id):
    """
    Delete a booking.
    Renters can delete their own bookings, and admins can delete any booking.
    """
    booking = get_object_or_404(Booking, id=booking_id)

    booking.delete()
    return Response({"message": "Booking deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def delete_property(request, pk):
    try:
        property = Property.objects.get(pk=pk)
        property.delete()
        return Response({"message": "Property deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Property.DoesNotExist:
        return Response({"error": "Property not found."}, status=status.HTTP_404_NOT_FOUND)