"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users.views import LoginView, UsersListView
from appointments.views import AvailableSlotsView, BookingCreateView, DashboardSummaryView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/users/", UsersListView.as_view(), name="users-list"),
    path("api/appointments/slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path("api/appointments/", BookingCreateView.as_view(), name="booking-create"),
    path("api/appointments/summary/", DashboardSummaryView.as_view(), name="app-summary"),
]
