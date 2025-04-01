<script lang="js" setup>
import { ref, toRaw } from 'vue';
import qs from 'qs';
import { nanoid } from 'nanoid';
import { ElMessage } from 'element-plus';
import humanizeDuration from 'humanize-duration';
import * as Api from '@src/api';
import JsonEditor from '@src/pages/workflow/app-design/run-drawer/json-editor.vue';

const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

const formData = ref({
  messageType: 'testMsgType',
  metadata: 'key1=value1&key2=value2',
  requestHeaders: `{
  "Content-Type": "application/json"
}`,
  requestBody: `{
  "temperature":68
}`,
  responseHeaders: '',
  responseBody: '',
});
const formRules = ref({
  messageType: [
    { required: true, message: '消息类型不能为空', trigger: 'blur' },
  ],
});
const showDrawer = ref(false);
const requestActiveName = ref('requestBody');
const requestEditorValue = ref(formData.value[requestActiveName.value] || '');
const responseActiveName = ref('responseBody');
const responseEditorValue = ref('');
const msgId = ref();
const logList = ref([]);
const bakLogData = ref({});
const outputResult = ref(true);
const collapseActiveNames = ref([]);
const collapseIsOpenAll = ref(false);
let socket = undefined;

function openDrawer() {
  msgId.value = nanoid();
  createWebSocket();
  showDrawer.value = true;
}

function closeDrawer() {
  socket.close();
  socket = undefined;
  showDrawer.value = false;
}

function requestTabClickHandler(tab) {
  const paneName = tab.paneName;
  requestEditorValue.value = formData.value[paneName] || '';
}

function responseTabClickHandler(tab) {
  const paneName = tab.paneName;
  responseEditorValue.value = formData.value[paneName] || '';
}

function createWebSocket() {
  if (socket) return;
  const id = props.flowData.ruleChain.id;
  socket = new WebSocket(
    `${window.config.wsURL}/api/v1/logs/ws/${id}/${msgId.value}`,
  );
  socket.onmessage = function (event) {
    const ruleChainId = props.flowData.ruleChain.id;
    let newLogData = bakLogData.value;
    let dataObject = JSON.parse(event.data);
    let nodeId = dataObject.nodeId;
    let receiveChainId = dataObject.chainId;

    if (receiveChainId !== ruleChainId) {
      return;
    }
    if (dataObject.flowType === 'Log') {
      let nodeLog = newLogData[nodeId];
      if (!nodeLog) {
        newLogData[nodeId] = {
          // Id 节点ID
          nodeId: nodeId,
          logItems: [],
        };
      } else {
        nodeLog.logItems.push(dataObject.msg.data);
      }
    } else if (dataObject.flowType === 'OUT') {
      let nodeLog = newLogData[nodeId];
      if (!nodeLog) {
        newLogData[nodeId] = {
          // Id 节点ID
          nodeId: nodeId,
          // OutMsg 输出消息
          outMsg: dataObject.msg,
          // RelationType 和下一个节点连接类型
          relationType: dataObject.relationType,
          // Err 错误信息
          err: dataObject.err,
          // LogItems 执行过程中的日志
          logItems: [],
          // EndTs执行结束时间
          endTs: event.ts || new Date().getTime(),
        };
      } else {
        nodeLog.outMsg = dataObject.msg;
        nodeLog.err = dataObject.err;
        nodeLog.relationType = dataObject.relationType;
        nodeLog.endTs = event.ts || new Date().getTime();
      }
    } else if (dataObject.flowType === 'IN') {
      let nodeLog = newLogData[nodeId];
      if (!nodeLog) {
        newLogData[nodeId] = {
          // Id 节点ID
          nodeId: nodeId,
          logItems: [],
          inMsg: dataObject.msg,
          startTs: event.ts || new Date().getTime(),
        };
      } else {
        nodeLog.inMsg = dataObject.msg;
        nodeLog.startTs = event.ts || new Date().getTime();
      }
    }
    bakLogData.value = newLogData;
    logList.value = Object.values(newLogData).sort((a, b) => {
      return a.startTs === b.startTs
        ? a.endTs - b.endTs
        : a.startTs - b.startTs;
    });
  };
  socket.onerror = function () {
    ElMessage.error('WebSocket 错误');
  };
}

async function sendHandler() {
  try {
    const id = props.flowData.ruleChain.id;
    const msgType = formData.value.messageType;
    const data = JSON.parse(formData.value.requestBody);
    const headers = JSON.parse(formData.value.requestHeaders);
    let params = qs.parse(formData.value.metadata);
    params.msgId = msgId.value;
    let res = undefined;
    if (outputResult.value) {
      res = await Api.executeRules({ id, msgType, data, headers, params });
    } else {
      res = await Api.notifyRules({ id, msgType, data, headers, params });
    }
    formData.value.responseHeaders = JSON.stringify(res.headers, null, '\t');
    formData.value.responseBody = JSON.stringify(res.data, null, '\t');
  } catch (data) {
    const response = data.response;
    formData.value.responseHeaders = JSON.stringify(
      response.headers,
      null,
      '\t',
    );
    formData.value.responseBody = JSON.stringify(response.data, null, '\t');
    ElMessage.error(data.message);
  }
}

function getNodeNameById(nodeId) {
  const rawRuleChain = toRaw(props.flowData);
  let metadata = rawRuleChain.metadata;
  if (metadata) {
    let node = metadata.nodes.find((node) => node.id === nodeId);
    if (node) {
      return node.name;
    }
  }
  return nodeId;
}

function getNodeTypeById(nodeId) {
  const rawRuleChain = toRaw(props.flowData);
  let metadata = rawRuleChain.metadata;
  if (metadata) {
    let node = metadata.nodes.find((node) => node.id === nodeId);
    if (node) {
      return node.type;
    }
  }
  return '';
}

function toggleCollapseOpenHandler() {
  if (collapseIsOpenAll.value) {
    collapseActiveNames.value = [];
    collapseIsOpenAll.value = false;
  } else {
    collapseActiveNames.value = Object.keys(bakLogData.value);
    collapseIsOpenAll.value = true;
  }
}

defineExpose({
  open: openDrawer,
  close: closeDrawer,
});
</script>

<template>
  <el-drawer
    v-model="showDrawer"
    direction="rtl"
    size="90%"
    class="run-drawer"
    custom-class="run-drawer"
    style="--el-drawer-padding-primary: 0px; margin-bottom: 0"
    :before-close="closeDrawer"
    :show-close="false"
  >
    <template #header="{ close }">
      <div class="flex justify-end border-b border-solid border-gray-200 p-2">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="sendHandler">发送</el-button>
      </div>
    </template>
    <div class="flex h-full w-full flex-col overflow-auto">
      <div class="flex-grow overflow-auto">
        <div class="flex h-[400px] min-h-full">
          <div
            class="flex w-1/2 flex-col border-r border-solid border-gray-200"
          >
            <div
              class="flex flex-none items-center justify-between p-2 text-slate-800"
            >
              <div>请求参数</div>
              <div>
                <el-checkbox v-model="outputResult" label="输出结果" />
              </div>
            </div>
            <div class="flex-none px-2">
              <el-form
                label-position="top"
                :model="formData"
                :rules="formRules"
              >
                <el-form-item label="消息类型" prop="messageType">
                  <el-input
                    v-model="formData.messageType"
                    placeholder="消息类型"
                  />
                </el-form-item>
              </el-form>
            </div>
            <div class="flex flex-grow flex-col overflow-auto px-2 pb-2">
              <div>
                <el-tabs
                  v-model="requestActiveName"
                  @tab-click="requestTabClickHandler"
                >
                  <el-tab-pane label="元数据" name="metadata"></el-tab-pane>
                  <el-tab-pane
                    label="请求头"
                    name="requestHeaders"
                  ></el-tab-pane>
                  <el-tab-pane label="请求体" name="requestBody"></el-tab-pane>
                </el-tabs>
              </div>
              <div class="flex-grow overflow-auto">
                <json-editor
                  v-model="formData[requestActiveName]"
                ></json-editor>
              </div>
            </div>
          </div>
          <div class="flex w-1/2 flex-col">
            <div class="flex-none p-2 text-slate-800">返回结果</div>
            <div class="flex flex-grow flex-col overflow-auto px-2 pb-2">
              <div>
                <el-tabs
                  v-model="responseActiveName"
                  @tab-click="responseTabClickHandler"
                >
                  <el-tab-pane label="响应体" name="responseBody"></el-tab-pane>
                  <el-tab-pane
                    label="响应头"
                    name="responseHeaders"
                  ></el-tab-pane>
                </el-tabs>
              </div>
              <div class="flex-grow overflow-auto">
                <json-editor
                  v-model="formData[responseActiveName]"
                ></json-editor>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex h-1/2 flex-none flex-col border-t border-solid border-gray-200 p-2"
      >
        <div
          class="flex flex-none items-center justify-between pb-2 text-slate-800"
        >
          <div>日志</div>
          <el-button @click="toggleCollapseOpenHandler">
            {{ collapseIsOpenAll ? '收起全部' : '展开全部' }}
          </el-button>
        </div>
        <div class="flex-grow overflow-auto">
          <div
            class="min-h-full overflow-hidden border border-solid border-gray-200"
          >
            <el-collapse v-model="collapseActiveNames">
              <el-collapse-item
                v-for="item in logList"
                :key="item.nodeId"
                :name="item.nodeId"
              >
                <template #title>
                  <div class="flex items-center px-2">
                    <el-icon v-if="!item.relationType" class="mr-1">
                      <el-icon-loading />
                    </el-icon>
                    <el-icon
                      v-else-if="
                        item.relationType === 'Success' ||
                        item.relationType === 'True'
                      "
                      class="mr-1"
                      color="#67C23A"
                    >
                      <el-icon-success-filled />
                    </el-icon>
                    <el-icon
                      v-else-if="
                        item.relationType === 'Failure' ||
                        item.relationType === 'False'
                      "
                      class="mr-1"
                      color="#F56C6C"
                    >
                      <el-icon-circle-close-filled />
                    </el-icon>
                    <el-tag v-else type="info" class="mr-1">
                      {{ item.relationType }}
                    </el-tag>
                    <div class="mr-1">{{ getNodeNameById(item.nodeId) }}</div>
                    <el-tag type="primary" class="mr-1">
                      {{ getNodeTypeById(item.nodeId) }}
                    </el-tag>
                    <div>
                      {{
                        humanizeDuration(
                          item.endTs - item.startTs < 0
                            ? 0
                            : item.endTs - item.startTs,
                          {
                            language: 'shortEn',
                            languages: {
                              shortEn: {
                                y: () => 'y',
                                mo: () => 'mo',
                                w: () => 'w',
                                d: () => 'd',
                                h: () => 'h',
                                m: () => 'm',
                                s: () => 's',
                                ms: () => 'ms',
                              },
                            },
                            largest: 2,
                            units: ['m', 's', 'ms'],
                          },
                        )
                      }}
                    </div>
                  </div>
                </template>
                <div class="overflow-hidden p-2">
                  <div class="rounded-md bg-[#e9e9eb] p-2">
                    <div class="mb-2 rounded-md bg-[#f4f4f5] p-2">
                      <div class="font-semibold">输入</div>
                      <div>{{ item.inMsg && item.inMsg.data }}</div>
                    </div>
                    <div class="mb-2 rounded-md bg-[#f4f4f5] p-2">
                      <div class="font-semibold">日志</div>
                      <div>
                        {{
                          item.logItems && item.logItems.length > 0
                            ? item.logItems[0]
                            : '无'
                        }}
                      </div>
                      <div v-for="(log, index) in item.logItems">
                        {{ index }}:{{ log }}
                      </div>
                    </div>
                    <div class="mb-2 rounded-md bg-[#f4f4f5] p-2">
                      <div class="font-semibold">输出</div>
                      <div>{{ item.outMsg && item.outMsg.data }}</div>
                    </div>
                    <div class="rounded-md bg-[#f4f4f5] p-2">
                      <div class="font-semibold">错误</div>
                      <div>{{ item.err || '无' }}</div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
:deep(.run-drawer .el-drawer__header) {
  margin: 0;
}
</style>
