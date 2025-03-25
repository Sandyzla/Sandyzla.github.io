class Tree {
  constructor(value) {
    this.value = value
    this.left = this.right = null
  }

  insert_left(value) {
    this.left = new Tree(value)
  }

  insert_right(value) {
    this.right = new Tree(value)
  }
}
let array = []
function get_postfix(root) {
  if (!root) return
  get_postfix(root.left)
  get_postfix(root.right)
  array.push(root.value)
}
