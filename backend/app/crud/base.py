from typing import Any, Generic, Type, TypeVar

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.utils.helpers import ModelType, sa_model_to_dict

CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CrudBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    async def get(self, session: AsyncSession, id: Any) -> ModelType | None:
        query = select(self.model).filter(self.model.id == id)
        result = await session.execute(query)
        return result.scalars().first()

    async def get_multi(
        self, session: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> list[ModelType]:
        query = select(self.model).offset(skip).limit(limit)
        result = await session.execute(query)
        all_scalars: list[ModelType] = result.scalars().all()  # type: ignore[assignment]
        return all_scalars

    async def create(self, session: AsyncSession, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data)
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def update(
        self, session: AsyncSession, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, Any]
    ) -> ModelType:
        obj_data = sa_model_to_dict(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def remove(self, session: AsyncSession, *, id: Any) -> ModelType | None:
        obj = await session.get(self.model, id)
        if obj:
            await session.delete(obj)
            await session.commit()
        return obj
