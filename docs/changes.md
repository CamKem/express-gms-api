# Potenial changes to the project

## Api Router
- [ ] Consider having different routers for different api versions
```js
const versionRouter = express.Router();
resourceFiles.forEach((file) => {
    const resource = path.basename(file, '.js');
    const resourceRouter = express.Router();
    versionRouter.use(`/${resource}`, resourceRouter);
});
apiRouter.use(`/${version}`, versionRouter);
```