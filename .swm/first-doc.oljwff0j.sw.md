---
title: First doc
---
the following feature is do ....

<SwmSnippet path="/crm-client/src/pages/ClientsPage.tsx" line="30">

---

&nbsp;

```tsx
  function handleAdd(
    data: Omit<Client, "id" | "status" | "createdAt" | "updatedAt">
  ) {
    fetch("http://localhost:3000/clients/mock-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((created) => setClients((prev) => [...prev, created]));
  }
```

---

</SwmSnippet>

\
<SwmToken path="/crm-client/src/pages/ClientsPage.tsx" pos="68:5:5" line-data="      &lt;h1&gt;מערכת CRM&lt;/h1&gt;">`CRM`</SwmToken>\
\
<SwmPath>[crm-client/…/pages/ClientsPage.tsx](/crm-client/src/pages/ClientsPage.tsx)</SwmPath>\
\
\
![](/.swm/images/download-2025-6-30-13-0-22-205.png)

&nbsp;

&nbsp;

&nbsp;

&nbsp;

<p align="center"><img src="/.swm/images/download-2025-6-30-13-0-46-957.png"></p>

<p align="center"><img src="https://media3.giphy.com/media/otnqsqqzmsw7K/giphy.gif?cid=d56c4a8blice17bs8h76xlah4bmo37dyr8k9wyu19gnqwuhb&amp;ep=v1_gifs_trending&amp;rid=giphy.gif&amp;ct=g"></p>

&nbsp;

<SwmMention uid="1ljAsX">[Oren Weinberg](mailto:orenweinberg@swimm.io)</SwmMention>

|   |   |   |
| - | - | - |
|   |   |   |
|   |   |   |

```mermaid

```

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBb3JlbnctdGVzdCUzQSUzQW9yZW53LXN3aW1t" repo-name="orenw-test"><sup>Powered by [Swimm](https://staging.swimm.cloud/)</sup></SwmMeta>
