from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///database.db"

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency used in routes to get a database session.
    Example:
        with get_session() as session:
            session.add(...)
    """
    with Session(engine) as session:
        yield session
