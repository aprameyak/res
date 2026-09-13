import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, JSON, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class EvaluationStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    resume_id = Column(Uuid, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    candidate_name = Column(String(255), nullable=True)
    status = Column(Enum(EvaluationStatus, native_enum=False), default=EvaluationStatus.PENDING, nullable=False)
    error_message = Column(Text, nullable=True)
    task_id = Column(String(255), nullable=True)

    open_source_score = Column(Float, nullable=True)
    open_source_max = Column(Float, default=35, nullable=True)
    open_source_evidence = Column(Text, nullable=True)

    self_projects_score = Column(Float, nullable=True)
    self_projects_max = Column(Float, default=30, nullable=True)
    self_projects_evidence = Column(Text, nullable=True)

    production_score = Column(Float, nullable=True)
    production_max = Column(Float, default=25, nullable=True)
    production_evidence = Column(Text, nullable=True)

    technical_skills_score = Column(Float, nullable=True)
    technical_skills_max = Column(Float, default=10, nullable=True)
    technical_skills_evidence = Column(Text, nullable=True)

    bonus_points_total = Column(Float, default=0, nullable=True)
    bonus_points_breakdown = Column(Text, nullable=True)
    deductions_total = Column(Float, default=0, nullable=True)
    deductions_reasons = Column(Text, nullable=True)

    total_score = Column(Float, nullable=True)

    key_strengths = Column(JSON, default=list, nullable=True)
    areas_for_improvement = Column(JSON, default=list, nullable=True)

    raw_result = Column(JSON, nullable=True)

    github_data = Column(JSON, nullable=True)

    job_description = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="evaluations")
    user = relationship("User", back_populates="evaluations")

    def __repr__(self) -> str:
        return f"<Evaluation id={self.id} score={self.total_score} status={self.status}>"


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    resume_id = Column(Uuid, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    evaluation_id = Column(Uuid, ForeignKey("evaluations.id", ondelete="SET NULL"), nullable=True)

    job_title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=False)

    match_percentage = Column(Float, nullable=True)
    missing_skills = Column(JSON, default=list, nullable=True)
    missing_experience = Column(JSON, default=list, nullable=True)
    keyword_coverage = Column(Float, nullable=True)
    recommendations = Column(JSON, default=list, nullable=True)

    raw_result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="job_matches")

    def __repr__(self) -> str:
        return f"<JobMatch id={self.id} match={self.match_percentage}%>"
