"""Update User and OAuthAccount models

Revision ID: 6f14afa8ea47
Revises: 397feb4e1315
Create Date: 2024-02-19 17:43:45.473226+01:00

"""

import fastapi_users_db_sqlalchemy.generics  # noqa
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "6f14afa8ea47"
down_revision = "397feb4e1315"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "caseinfo",
        "diseases",
        existing_type=postgresql.JSONB(astext_type=sa.Text()),
        type_=sa.JSON(),
        existing_nullable=True,
    )
    op.alter_column(
        "caseinfo",
        "hpo_terms",
        existing_type=postgresql.JSONB(astext_type=sa.Text()),
        type_=sa.JSON(),
        existing_nullable=True,
    )

    # Delete conflicting rows in oauth_account before adding unique constraint
    op.execute(
        """
    BEGIN;
    -- Create a temporary table to store the ids of the rows to keep
    CREATE TEMP TABLE keep_rows AS
    SELECT DISTINCT ON (oauth_name, user_id) id
    FROM oauth_account;
    -- Delete rows from oauth_account that are not in the keep_rows temporary table
    DELETE FROM oauth_account
    WHERE id NOT IN (SELECT id FROM keep_rows);
    DROP TABLE keep_rows;
    COMMIT;
    """
    )

    op.create_unique_constraint(None, "oauth_account", ["oauth_name", "user_id"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "oauth_account", type_="unique")
    op.alter_column(
        "caseinfo",
        "hpo_terms",
        existing_type=sa.JSON(),
        type_=postgresql.JSONB(astext_type=sa.Text()),
        existing_nullable=True,
    )
    op.alter_column(
        "caseinfo",
        "diseases",
        existing_type=sa.JSON(),
        type_=postgresql.JSONB(astext_type=sa.Text()),
        existing_nullable=True,
    )
    # ### end Alembic commands ###
