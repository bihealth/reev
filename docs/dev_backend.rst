.. _backend_development:

===================
Backend Development
===================

.. admonition:: Developer or User?

    This section is part of the instrutions for programmers interested in REEV.
    If you want to **use** REEV, the best place is to start at :ref:`doc_quickstart`.

-----
Types
-----

- prefer to use semantic-carrying types, e.g., ``enum.Enum`` over ``bool`` or ``int``

--------------
Test Structure
--------------

- use assemble, act, assert structure e.g., `as described here <http://wiki.c2.com/?AssembleActivateAssert>`__
- properly use fixtures, place them in ``conftest.py`` files
- use ``pytest.mark.parameterize`` to condense multiple test cases into one tests but don't overdo it
    - see ``test_clinvarsub.py`` for an example (e.g., ``test_create_submissionthreads``) that is still good a trade-off but probably shows the highest degree of complexity (read: different test code paths)
