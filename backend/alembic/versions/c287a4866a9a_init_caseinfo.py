"""init caseinfo

Revision ID: c287a4866a9a
Revises: 27c3977494f7
Create Date: 2023-10-30 18:59:28.025459+01:00

"""
import fastapi_users_db_sqlalchemy.generics  # noqa
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "c287a4866a9a"
down_revision = "27c3977494f7"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "caseinfo",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("user", sa.Uuid(), nullable=False),
        sa.Column("pseudonym", sa.String(length=255), nullable=True),
        sa.Column("diseases", sa.JSON(), nullable=True),
        sa.Column("hpo_terms", sa.JSON(), nullable=True),
        sa.Column(
            "inheritance",
            sa.Enum(
                "AutosomalDominant",
                "AutosomalRecessive",
                "Cosegregation",
                "GeneticAnticipation",
                "GeneticLinkage",
                "XLinkedRecessive",
                "Unknown",
                name="inheritance",
            ),
            nullable=True,
        ),
        sa.Column("affected_family_members", sa.Boolean(), nullable=True),
        sa.Column("sex", sa.Enum("Male", "Female", "Unknown", name="sex"), nullable=True),
        sa.Column("age_of_onset_month", sa.Integer(), nullable=True),
        sa.Column(
            "ethinicity",
            sa.Enum(
                "AfricanAmerican",
                "AshkenaziJewish",
                "EastAsian",
                "Finnish",
                "European",
                "Latino",
                "MiddleEastern",
                "SouthAsian",
                "Other",
                "Unknown",
                name="ethnicity",
            ),
            nullable=True,
        ),
        sa.Column(
            "zygosity",
            sa.Enum(
                "Heterozygous", "Homozygous", "CompoundHeterozygous", "Unknown", name="zygosity"
            ),
            nullable=True,
        ),
        sa.Column("family_segregation", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["user"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_caseinfo_id"), "caseinfo", ["id"], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_caseinfo_id"), table_name="caseinfo")
    op.drop_table("caseinfo")
    # ### end Alembic commands ###
