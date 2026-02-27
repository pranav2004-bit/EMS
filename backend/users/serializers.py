from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        attrs['user'] = user
        return attrs


class HRUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'password', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data, role='hr')
        user.set_password(password)
        user.save()
        return user


class HRUserUpdateSerializer(serializers.ModelSerializer):
    reset_password = serializers.BooleanField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'is_active', 'reset_password', 'new_password', 'updated_at']
        read_only_fields = ['id', 'name', 'email', 'updated_at']

    def update(self, instance, validated_data):
        reset_password = validated_data.pop('reset_password', False)
        new_password = validated_data.pop('new_password', None)

        instance.is_active = validated_data.get('is_active', instance.is_active)

        if reset_password and new_password:
            instance.set_password(new_password)

        instance.save()
        return instance


class HRUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'is_active', 'created_at', 'updated_at']
