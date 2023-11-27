from app.crud.acmgseqvar import CrudAcmgSeqVar
from app.crud.base import CrudBase
from app.crud.bookmarks import CrudBookmark
from app.crud.caseinfo import CrudCaseInfo
from app.models.acmgseqvar import AcmgSeqVar
from app.models.adminmsg import AdminMessage
from app.models.bookmark import Bookmark
from app.models.caseinfo import CaseInfo
from app.schemas.adminmsg import AdminMessageCreate, AdminMessageUpdate

adminmessage = CrudBase[AdminMessage, AdminMessageCreate, AdminMessageUpdate](AdminMessage)
bookmark = CrudBookmark(Bookmark)
caseinfo = CrudCaseInfo(CaseInfo)
acmgseqvar = CrudAcmgSeqVar(AcmgSeqVar)
