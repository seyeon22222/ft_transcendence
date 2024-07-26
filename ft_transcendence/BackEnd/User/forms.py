from django import forms
from User.model.MyUser import MyUser

class signForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput)

    class Meta:
        model = MyUser
        fields = ['username', 'password', 'email']
