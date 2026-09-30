# User Roles and Permissions

| Capability | Student | Teacher | Admin |
|---|:---:|:---:|:---:|
| Register/login/logout | ✓ | ✓ | ✓ |
| View assignments | ✓ | ✓ | ✓ |
| Create/update/delete assignments | — | ✓ | ✓ |
| Create/manage courses | — | ✓ | ✓ |
| Upload assignment | ✓ | — | — |
| Resubmit | ✓ | — | — |
| View own submissions | ✓ | ✓* | ✓ |
| View/download course submissions | — | ✓ | ✓ |
| Grade submissions | — | ✓ | ✓ |
| View marks/feedback | ✓ | ✓ | ✓ |
| Manage users/roles | — | — | ✓ |
| View analytics | — | ✓ | ✓ |

`*` Teachers can access submissions belonging to courses they own. The data model stores `teacherId` on assignments and submissions so Firestore queries can align with Security Rules. Firestore Rules are not filters, so authorization-aware query constraints matter. citeturn196755search4

Public registration creates only the `student` role. Teacher/admin roles must be provisioned by an authorized process, which prevents an unauthenticated visitor from promoting themselves to teacher.
