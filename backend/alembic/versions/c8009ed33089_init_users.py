"""init users

Revision ID: c8009ed33089
Revises:
Create Date: 2023-09-28 10:41:24.861855+02:00

"""

import fastapi_users_db_sqlalchemy.generics  # noqa
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "c8009ed33089"
down_revision = None
branch_labels = None
depends_on = None

#: Long tokens -- 64kbytes should be enough for everyone
TOKEN_SIZE = 64 * 1024


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("hashed_password", sa.String(length=1024), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), nullable=False),
        sa.Column("is_verified", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_user_email"), "user", ["email"], unique=True)
    op.create_table(
        "oauth_account",
        sa.Column("id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("user_id", fastapi_users_db_sqlalchemy.generics.GUID(), nullable=False),
        sa.Column("oauth_name", sa.String(length=100), nullable=False),
        sa.Column("access_token", sa.String(length=TOKEN_SIZE), nullable=False),
        sa.Column("expires_at", sa.BigInteger(), nullable=True),
        sa.Column("refresh_token", sa.String(length=TOKEN_SIZE), nullable=True),
        sa.Column("account_id", sa.String(length=320), nullable=False),
        sa.Column("account_email", sa.String(length=320), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="cascade"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_oauth_account_account_id"), "oauth_account", ["account_id"], unique=False
    )
    op.create_index(
        op.f("ix_oauth_account_oauth_name"), "oauth_account", ["oauth_name"], unique=False
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_oauth_account_oauth_name"), table_name="oauth_account")
    op.drop_index(op.f("ix_oauth_account_account_id"), table_name="oauth_account")
    op.drop_table("oauth_account")
    op.drop_index(op.f("ix_user_email"), table_name="user")
    op.drop_table("user")
    # ### end Alembic commands ###
