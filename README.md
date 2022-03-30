# React-Ts-Mobx-Vite

这是一个基于 Vite 的 React 应用程序模板。

## Features

- 包括[网络请求](#http-request)、[外部状态管理](#external-state-manager)在内全部由 TypeScript 编写。

- 集成 prettier、 eslint 等代码规范化工具。

- 基于 Vite 架构，开发速度有保障。

## External State Manager

这里选择的是`mobx`，mobx 的优点在于体积小速度快（相对于 redux），以及天然支持 mutable 状态修改（因为其使用观察者模式管理状态）。

mobx 的配置文件位于**src/stores**，其中**rootStore.ts**作用是整合多个 store，并使用 react context 进行包装，**couter.ts**编写 store 示例程序。

在 react hook 中使用 store 如下：

```tsx
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from 'src/stores/rootStore';

function App() {
  // 使用react useConext hook
  const store = useContext(StoreContext);

  return (
    <div>
      {store.countStore.count}
      <button onClick={store.countStore.increase}> + </button>
      <button onClick={store.countStore.descrease}> - </button>
    </div>
  );
}

// 最后必须使用observer进行包装
export default observer(App);
```

## Http Request

网络请求方案参考[axtis](https://github.com/kinglisky/axits)，是基于 Axios 的二次封装，其优点在于有对 Api 接口进行封装，对 axios 的封装也具有扩展性。

Http Request 配置文件位于**src/apis**，其中**request.d.ts**是类型声明， **request.ts**是 axits 程序， **TestApi.ts**是示例

## License

MIT
