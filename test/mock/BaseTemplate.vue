<template>
  <div class="hello-world">{{ msg }}</div>
</template>

<script>
import Foo from "./Foo"

const foo = () => { }

const obj = { a: 1 }

console.log(obj?.a)

export default {
  components: {
    Foo
  },
  data() {
    return {
      msg: 'Hello World',
      arr: [...[1, 2, 3]]
    }
  }
}
</script>

<style lang="less" scoped>
.hello {
  &-world {
    color: white;
  }
}
</style>
