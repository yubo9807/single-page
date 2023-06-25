# 响应式原生页面

## 说明

一个支持响应式数据的原生 js 单页应用，支持双击 .html 直接运行。

### 已注册全局变量：

- `vue`
- 页面执行函数（添加页面自行注册）：`pageHome` `pageAbout`

## 添加页面方法：

1. 在页面中添加节点，并添加 class 属性 `class="page page-demo"`;
2. js 下添加 page-demo.js 文件；
3. 文件中声明一个函数，函数内部就是该页面的逻辑；
4. 在 js/router.js 开头 routes 中添加配置。

### 切换页面：

```js
const router = vue.useRouter();
router.push('/about');
```

> 切换页面后会重新渲染

## 响应式数据：

```js
const { ref, reactive, binding } = vue;

// 1. 声明：vue.ref 或 vue.reactive；
const a = ref(0);  // 可传任意数据类型
a.value = 123;     // 改变数据

const arr = reactive([0]);  // 可传数组或对象
arr[0] = 1;                 // 改变数据

// 2. 绑定自动更新对象：
binding(() => {        // 函数中的代码会在数据发生改变时自动运行
  el.innerText = a.value;  // 这里可以绑定任何对象：style class dom 等
})
```

### 侦听器：

```js
const unWatch = vue.watch(    // 返回一个函数，unWatch 后会结束侦听
  () => a.value,                     // 响应式数据
  (newValue, oldValue) => {},        // 自执行函数
  { immediate: false, deep: true },  // 配置项  immediate: 一开始就执行  deep: 深度监听
)
```

> 响应式代码示例： js/page-home.js
