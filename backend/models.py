from sqlalchemy import Column, Integer, String, LargeBinary, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class ProjectFile(Base):
    __tablename__ = 'project_files'
    id = Column(Integer, primary_key=True)
    project_id = Column(String, index=True)
    filename = Column(String)
    content = Column(LargeBinary)

# PostgreSQL DB
engine = create_engine('postgresql+psycopg2://postgres:postgres@localhost:5432/SBOX')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
