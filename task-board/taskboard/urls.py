from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("lists", views.create_list, name="create_list"),
    path("lists/<int:list_id>", views.list, name="list"),
    path("lists/<str:view>", views.view, name="view"),

    path("tasks", views.create_task, name="create_task"),
    path("tasks/<int:tasks_id>", views.tasks, name="tasks"),
    path("tasks/<str:view1>", views.view1, name="view1"),
    path("task/<int:task_id>", views.task, name="task"),
    path("task_selected/<int:task_id>", views.task_selected, name="task_selected"),
]
