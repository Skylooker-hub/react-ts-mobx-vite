import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "src/stores/rootStore";

function App() {
  const store = useContext(StoreContext);

  return (
    <div>
      {store.countStore.count}
      <button onClick={store.countStore.increase}> + </button>
      <button onClick={store.countStore.descrease}> - </button>
    </div>
  );
}

export default observer(App);
