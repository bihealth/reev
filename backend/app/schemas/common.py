"""Common schema-related code"""

from typing import TypeAlias

from pydantic import constr

#: Regular expression for sequence variants.
RE_SEQVAR = r"^(grch37|grch38)-([1-9]|1[0-9]|2[12]|X|Y|MT)-(\d+)-([CGAT]+)-([CGAT]+)$"

#: Regular expression for structurals variants.
RE_STRUCVAR = r"^(DEL|DUP)-(grch37|grch38)-([1-9]|1[0-9]|2[12]|X|Y|MT)-(\d+)-(\d+)$"

#: Regular expression for HGNC IDs.
RE_HGNCID = r"^HGNC:(\d+)$"

#: Type for a sequence variant name.
SeqvarName: TypeAlias = constr(  # type: ignore
    min_length=1, strip_whitespace=True, pattern=RE_SEQVAR
)

#: Type for a structural variant name.
StrucvarName: TypeAlias = constr(  # type: ignore
    min_length=1, strip_whitespace=True, pattern=RE_STRUCVAR
)

#: Type for either a sequence or a structural variant name.
VarName: TypeAlias = constr(  # type: ignore
    min_length=1, strip_whitespace=True, pattern=f"{RE_SEQVAR}|{RE_STRUCVAR}"
)

#: Type for a HGNC ID.
HgncId: TypeAlias = constr(min_length=1, strip_whitespace=True, pattern=RE_HGNCID)  # type: ignore

#: Type for a bookmarkable object.
BookmarkableId: TypeAlias = constr(  # type: ignore
    min_length=1, strip_whitespace=True, pattern=f"{RE_SEQVAR}|{RE_STRUCVAR}|{RE_HGNCID}"
)
