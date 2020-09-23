import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container,
  Aside, Main, Header, Menu, MenuItem, MenuItemGroup, Submenu,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn,
  Pagination, Dialog, Tag, Select, Option, MessageBox, Tree, Cascader,
  Tabs, TabPane, Alert, Steps, Step, CheckboxGroup, Checkbox, Upload
} from 'element-ui'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.component('tree-table', TreeTable)
Vue.prototype.$msg = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(VueQuillEditor)
