from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Task, TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Task  # adjust import if needed
from app.database import get_session  # adjust to your actual path

router = APIRouter(prefix="/tasks", tags=["tasks"])

# ... your existing GET / POST / PATCH endpoints ...

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()


@router.get("/", response_model=List[TaskRead])
def list_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(select(Task).order_by(Task.created_at.desc())).all()
    return tasks


@router.post(
    "/", response_model=TaskRead, status_code=status.HTTP_201_CREATED
)
def create_task(payload: TaskCreate, session: Session = Depends(get_session)):
    task = Task.from_orm(payload)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int, payload: TaskUpdate, session: Session = Depends(get_session)
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    data = payload.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"ok": True}
