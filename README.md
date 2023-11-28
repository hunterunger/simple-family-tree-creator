# Simple Family Tree Maker

Use a simple YAML syntax to create a visual family tree.

Here's an example of the family syntax:

```yaml
Mom Willson + Dad Smith [Optional Title]:
    - Child1
    - Child2
    - Child3
```

## Flowchart

(This might not render, depending on your markdown viewer.)

```mermaid
flowchart TB

classDef blue fill:#66deff,stroke:#000,color:#000


%% GENERATION 0%%
DadSmith("Dad Smith") --- DadMom(Optional Title)
MomWillson("Mom Willson") --- DadMom(Optional Title)

DadMom(Optional Title) --> Child1Smith("Child1 Smith")
DadMom(Optional Title) --> Child2Smith("Child2 Smith")
DadMom(Optional Title) --> Child3Smith("Child3 Smith")

```

# Setup

Run `npm run dev` to start the server on `localhost:3000`.
