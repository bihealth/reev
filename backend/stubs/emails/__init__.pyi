import typing

from emails.template import JinjaTemplate

class Message:
    def __init__(
        self,
        subject: JinjaTemplate,
        html: JinjaTemplate,
        mail_from: typing.Tuple[typing.Optional[str], typing.Optional[str]],
    ): ...
    def send(
        self,
        *,
        to: str,
        render: typing.Dict[str, typing.Any],
        smtp: typing.Dict[str, typing.Any],
    ): ...
