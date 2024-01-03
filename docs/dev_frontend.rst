.. _frontend_development:

====================
Frontend Development
====================

This section describes the best practices to use for frontend development.

------------
Import Order
------------

Import order should be (and is also enforced by prettier):

- external packages
- project includes with ``@/`` prefix
- relative includes with ``./`` prefix

Overall, restrict relative include order for tests to include code to be tested with ``../``.

-----
Types
-----

- For the Vue reactive stores, explicitely specify the type in the creating function, e.g., `ref<string>` or `ref<string | undefined>`.
- In many places in the UI, using `undefined` is more appropriate than `null` as this is the value before the data is loaded from the backend.

--------------
Test Structure
--------------

Consider the following structure, an example is given below.

- imports
- define fixture data
    - put larger fixture data into ``.json`` files within the ``__tests__`` folders (will go to LFS by our ``.gitattributes`` configuration)
- define the tests
- use assemble, act, assert structure e.g., `as described here <http://wiki.c2.com/?AssembleActivateAssert>`__
    - guard assertions are OK
- use ``describe.concurrent`` to describe the tests, usually one block per ``.spec.ts`` file
- use ``it`` to define the tests
    - use ``async () => { ... }`` only when necessary, e.g., for ``await nextTick()``
- use the ``setupMountedComponents()`` helper from ``@/components/__tests__/utils`` to mount components, setup store, and setup router with mocks

.. literalinclude:: ../frontend/src/components/__tests__/UserProfileButton.spec.ts
    :language: typescript

Note that there is a separation between views and components (cf. https://stackoverflow.com/a/50866150/84349) that is also reflected in the tests.

- The main purpose of views is to handle the routing.
- The actual work happens in components.

In tests, we thus use stubbed out of nested components in views but not components.
This keeps the load time acceptable while testing the components in isolation.
