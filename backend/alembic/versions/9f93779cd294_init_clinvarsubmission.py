"""init clinvarsubmission

Revision ID: 9f93779cd294
Revises: d10fec1c88fc
Create Date: 2023-12-13 10:46:23.236550+01:00

"""
import fastapi_users_db_sqlalchemy.generics  # noqa
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "9f93779cd294"
down_revision = "d10fec1c88fc"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "clinvarsubmissionuserorg",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("owner", sa.Uuid(), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("clinvar_api_token", sa.String(length=255), nullable=False),
        sa.ForeignKeyConstraint(["owner"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_clinvarsubmissionuserorg_id"), "clinvarsubmissionuserorg", ["id"], unique=False
    )
    op.create_table(
        "clinvarsubmissionthread",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("clinvarsubmittingorg", sa.Uuid(), nullable=False),
        sa.Column("primary_variant_id", sa.String(length=1024), nullable=False),
        sa.Column("effective_scv", sa.String(length=32), nullable=True),
        sa.Column(
            "effective_presence", sa.Enum("ABSENT", "PRESENT", name="presence"), nullable=True
        ),
        sa.Column(
            "desired_presence", sa.Enum("ABSENT", "PRESENT", name="presence"), nullable=False
        ),
        sa.Column(
            "status",
            sa.Enum(
                "INITIAL",
                "SUBMITTED",
                "IN_PROGRESS",
                "WAITING",
                "COMPLETE",
                "FAILED",
                name="status",
            ),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["clinvarsubmittingorg"], ["clinvarsubmissionuserorg.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "clinvarsubmissionthread_org_variantid",
        "clinvarsubmissionthread",
        ["clinvarsubmittingorg", "primary_variant_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_clinvarsubmissionthread_id"), "clinvarsubmissionthread", ["id"], unique=False
    )
    op.create_table(
        "clinvarsubmissionactivity",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("clinvarsubmissionthread", sa.Uuid(), nullable=False),
        sa.Column(
            "kind",
            sa.Enum("RETRIEVE", "CREATE", "UPDATE", "DELETE", name="activitykind"),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum("INITIAL", "SUBMITTED", "IN_PROGRESS", "COMPLETE", "FAILED", name="status"),
            nullable=False,
        ),
        sa.Column("request_payload", sa.JSON(), nullable=True),
        sa.Column("request_timestamp", sa.DateTime(), nullable=False),
        sa.Column(
            "response_status",
            sa.Enum("INITIAL", "SUBMITTED", "IN_PROGRESS", "COMPLETE", "FAILED", name="status"),
            nullable=True,
        ),
        sa.Column("response_payload", sa.JSON(), nullable=True),
        sa.Column("response_timestamp", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["clinvarsubmissionthread"], ["clinvarsubmissionthread.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_clinvarsubmissionactivity_id"), "clinvarsubmissionactivity", ["id"], unique=False
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_clinvarsubmissionactivity_id"), table_name="clinvarsubmissionactivity")
    op.drop_table("clinvarsubmissionactivity")
    op.drop_index(op.f("ix_clinvarsubmissionthread_id"), table_name="clinvarsubmissionthread")
    op.drop_index("clinvarsubmissionthread_org_variantid", table_name="clinvarsubmissionthread")
    op.drop_table("clinvarsubmissionthread")
    op.drop_index(op.f("ix_clinvarsubmissionuserorg_id"), table_name="clinvarsubmissionuserorg")
    op.drop_table("clinvarsubmissionuserorg")
    # ### end Alembic commands ###
