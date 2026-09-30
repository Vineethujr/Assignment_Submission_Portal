# Testing Strategy

## 25 manual/functional test cases

| ID | Scenario | Input | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| T01 | Student registration | Valid name/email/password | Student account created | Fill during demo | ☐ |
| T02 | Teacher login | Teacher credentials | Teacher dashboard opens | Fill during demo | ☐ |
| T03 | Invalid login | Wrong password | Error shown; no dashboard | Fill during demo | ☐ |
| T04 | Student dashboard authorization | Student opens `/teacher` | Redirect/denial | Fill during demo | ☐ |
| T05 | Teacher dashboard authorization | Teacher opens `/student` | Redirect/denial | Fill during demo | ☐ |
| T06 | Create assignment | Valid course/title/deadline | Assignment saved in Firestore | Fill during demo | ☐ |
| T07 | View assignment | Student loads assignment list | Published assignment visible | Fill during demo | ☐ |
| T08 | Valid PDF upload | PDF ≤ limit | File uploaded and metadata saved | Fill during demo | ☐ |
| T09 | Invalid extension | `.exe` | Upload rejected | Fill during demo | ☐ |
| T10 | Oversized file | > configured limit | Upload rejected | Fill during demo | ☐ |
| T11 | On-time submission | Time before deadline | `SUBMITTED` | Fill during demo | ☐ |
| T12 | Late submission | Time after deadline | `LATE` or rejection based on policy | Fill during demo | ☐ |
| T13 | Resubmission | Second upload | New version created | Fill during demo | ☐ |
| T14 | Own submission | Student A opens own record | Accessible | Fill during demo | ☐ |
| T15 | Other student's submission | Student A requests Student B record | Rejected | Fill during demo | ☐ |
| T16 | Teacher submissions | Teacher opens assignment | Course submissions listed | Fill during demo | ☐ |
| T17 | Grading | Valid marks + feedback | Record becomes `GRADED` | Fill during demo | ☐ |
| T18 | Marks above max | 101/100 | Request rejected | Fill during demo | ☐ |
| T19 | Feedback retrieval | Student views graded work | Marks/feedback visible | Fill during demo | ☐ |
| T20 | Unauthorized grading | Student calls grade endpoint | 403/rejected | Fill during demo | ☐ |
| T21 | File retrieval | Authorized user opens file | File available | Fill during demo | ☐ |
| T22 | Storage failure | Simulated network/storage error | No false submission success | Fill during demo | ☐ |
| T23 | Database failure | Simulated Firestore error | Error shown, no false success | Fill during demo | ☐ |
| T24 | Logout | Sign out | Session ends | Fill during demo | ☐ |
| T25 | Protected route after logout | Open dashboard URL | Redirect to login | Fill during demo | ☐ |

## Automated tests

Frontend:

```bash
npm --prefix frontend test
```

The included Vitest tests verify deadline classification and upload validation. The Functions folder includes tests for deadline logic.

For production-quality CI, add Firebase Local Emulator Suite tests for Firestore/Storage Security Rules. Firebase recommends Emulator-based Rules tests as part of development and CI. citeturn196755search6turn196755search2
