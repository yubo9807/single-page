function pageHome() {

  // 响应式数据
  const { binding, ref, watch } = vue;

  const el = document.getElementsByClassName('demo')[0];
  const count = ref(0);

  // 这里的函数只要包含有响应式数据，数据一但改动就会自动运行
  binding(() => {
    el.innerText = count.value;
  })

  const btn = document.getElementsByClassName('btn')[0];
  btn.addEventListener('click', () => {
    count.value ++;
  });



  // 数据监听
  const unWatch = watch(() => count.value, (value, oldValue) => {
    if (value > 5) return unWatch();
    console.log(value);
  })



  // 页面跳转
  const { useRouter } = vue;
  const router = useRouter();
  const toAbout = document.getElementsByClassName('to-about')[0];
  toAbout.addEventListener('click', () => {
    router.push('/about')
  })
}
