import json
from unicodedata import name
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import Task, User, List


def index(request):

    # Authenticated users view their lists
    if request.user.is_authenticated:
        return render(request, "taskboard/board.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


@csrf_exempt
@login_required
def create(request):

    # Composing a new list must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    name = data.get("name", "")
    # Create one list
    list = List(
            name=name,
        )
    list.save()

    return JsonResponse({"message": "List sent successfully."}, status=201)


@login_required
def view(request, view):

    # Filter lists returned based on view
    if view == "list":
        lists = List.objects.filter(
            deleted=False
        )
    elif view == "deleted":
        lists = List.objects.filter(
            deleted=True
        )
    else:
        return JsonResponse({"error": "Invalid view."}, status=400)

    # Return lists in reverse chronologial order
    lists = lists.order_by("-timestamp").all()
    return JsonResponse([list.serialize() for list in lists], safe=False)


@csrf_exempt
@login_required
def list(request, list_id):

    # Query for requested list
    try:
        list = List.objects.get(name=request.body, pk=list_id)
    except List.DoesNotExist:
        return JsonResponse({"error": "List not found."}, status=404)

    # Return list contents
    if request.method == "GET":
        return JsonResponse(list.serialize())
        print(list)

    # Update whether list is deleted
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("deleted") is not None:
            list.deleted = data["deleted"]
        list.save()
        return HttpResponse(status=204)

    # List must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@csrf_exempt
@login_required
def task(request, task_id):

    # Query for requested list
    try:
        task = Task.objects.get(name=request.body, pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found."}, status=404)

    # Return list contents
    if request.method == "GET":
        return JsonResponse(task.serialize())
        print(task)

    # Update whether list is deleted
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("deleted") is not None:
            task.deleted = data["deleted"]
        task.save()
        return HttpResponse(status=204)

    # List must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "taskboard/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "taskboard/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "taskboard/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "taskboard/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "taskboard/register.html")
