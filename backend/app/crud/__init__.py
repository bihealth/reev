from app.crud.base import CrudBase
from app.crud.bookmarks import CrudBookmark
from app.models.adminmsg import AdminMessage
from app.models.bookmark import Bookmark
from app.schemas.adminmsg import AdminMessageCreate, AdminMessageUpdate
from app.schemas.bookmark import BookmarkCreate, BookmarkUpdate

adminmessage = CrudBase[AdminMessage, AdminMessageCreate, AdminMessageUpdate](AdminMessage)
bookmark = CrudBookmark(Bookmark)
