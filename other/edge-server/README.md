TODO: Explain the Edge Server template app and provide instructions
for installing and running all the things.

React client -> Express server (Node.js driver) -> Edge Server -> Atlas

Node.js driver logic lives in the Express server. This is a MERN
stack that connects to the Edge Server instead of Atlas. https://www.mongodb.com/languages/mern-stack-tutorial

1. Start Docker engine
2. Start Edge Server
3. Start Node server
4. Run React app
