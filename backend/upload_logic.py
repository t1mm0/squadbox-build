from models import ProjectFile, SessionLocal
import os

def save_file_to_db(project_id, fileobj, filename):
    session = SessionLocal()
    content = fileobj.read()
    pf = ProjectFile(project_id=project_id, filename=filename, content=content)
    session.add(pf)
    session.commit()
    session.close()

def save_files(project_id, files):
    for file in files:
        save_file_to_db(project_id, file.file, file.filename)
