"""Modify the AcmgSeqVar table by dropping PP5&BP6 and making criteria uppercase.

Revision ID: b0881f58b8cf
Revises: d10fec1c88fc
Create Date: 2023-12-20 11:32:03.060426+01:00

"""
from alembic import op
import sqlalchemy as sa


import fastapi_users_db_sqlalchemy.generics  # noqa

# revision identifiers, used by Alembic.
revision = 'b0881f58b8cf'
down_revision = 'd10fec1c88fc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
