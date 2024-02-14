"""Update JSON keys in caseinfo table

Revision ID: 397feb4e1315
Revises: 850ccab0221d
Create Date: 2024-02-14 12:42:36.371531+01:00

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "397feb4e1315"
down_revision = "850ccab0221d"
branch_labels = None
depends_on = None


def upgrade():
    # Convert diseases and hpo_terms columns to jsonb if they aren't already
    op.execute("ALTER TABLE caseinfo ALTER COLUMN diseases TYPE jsonb USING diseases::jsonb")
    op.execute("ALTER TABLE caseinfo ALTER COLUMN hpo_terms TYPE jsonb USING hpo_terms::jsonb")

    # Update the diseases jsonb structure
    op.execute(
        """
        UPDATE caseinfo
        SET diseases = (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'omimId', value->'omim_id',
                    'name', value->'name'
                )
            )
            FROM jsonb_array_elements(diseases)
        )
        WHERE diseases IS NOT NULL
    """
    )

    # Update the hpo_terms jsonb structure
    op.execute(
        """
        UPDATE caseinfo
        SET hpo_terms = (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'termId', value->'term_id',
                    'name', value->'name'
                )
            )
            FROM jsonb_array_elements(hpo_terms)
        )
        WHERE hpo_terms IS NOT NULL
    """
    )


def downgrade():
    # Note: The downgrade logic here assumes the only keys were 'omimId', 'termId', and 'name'.
    # If there were other keys or if the original structure was different, adjust accordingly.

    # Revert the diseases jsonb structure update
    op.execute(
        """
        UPDATE caseinfo
        SET diseases = (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'omim_id', value->'omimId',
                    'name', value->'name'
                )
            )
            FROM jsonb_array_elements(diseases)
        )
        WHERE diseases IS NOT NULL
    """
    )

    # Revert the hpo_terms jsonb structure update
    op.execute(
        """
        UPDATE caseinfo
        SET hpo_terms = (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'term_id', value->'termId',
                    'name', value->'name'
                )
            )
            FROM jsonb_array_elements(hpo_terms)
        )
        WHERE hpo_terms IS NOT NULL
    """
    )
