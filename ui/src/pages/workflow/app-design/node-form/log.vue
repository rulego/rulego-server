<script lang="js" setup>
import { onMounted, ref, onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import beautify from 'js-beautify';
import * as Api from '@src/api';
import EventBus from '@src/utils/event-bus';
import JsonEditor from '@src/components/json-editor/json-editor.vue';

const props = defineProps({
  selectedNodeId: {
    type: [Number, String],
  },
  chainId: {
    type: [Number, String],
  },
});

const refreshNodeLogBus = EventBus.refreshNodeLog();

const tableData = ref([]);
const paginationState = ref({
  page: 1,
  size: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 0,
});
const dialogTitle = ref('');
const isDialogOpen = ref(false);
const dialogData = ref('');

async function refreshTableData() {
  const res = await Api.getLogsDebug({
    size: paginationState.value.size,
    page: paginationState.value.page,
    chainId: props.chainId,
    nodeId: props.selectedNodeId,
  });

  tableData.value = res.items;
  paginationState.value.total = res.total;
}

function paginationChangeHandler(currentPage, pageSize) {
  paginationState.value.page = currentPage;
  paginationState.value.size = pageSize;
  refreshTableData();
}

function tsFormatter(row, column) {
  return dayjs(row.ts).format('YYYY-MM-DD HH:mm:ss');
}

function openDialog() {
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

function showDataHandler(msg) {
  dialogTitle.value = '数据';
  dialogData.value = beautify.js(msg.data, { indent_size: 2 });
  openDialog();
}

function showMetadataHandler(msg) {
  dialogTitle.value = '元数据';
  dialogData.value = beautify.js(JSON.stringify(msg.metadata), {
    indent_size: 2,
  });
  openDialog();
}

function showErrorHandler(err) {
  dialogTitle.value = '错误';
  dialogData.value = err || '';
  openDialog();
}

onMounted(() => {
  refreshTableData();
  refreshNodeLogBus.on(refreshTableData);
});

onBeforeMount(() => {
  refreshNodeLogBus.off(refreshTableData);
});
</script>

<template>
  <div class="px-2">
    <div class="flex justify-end p-2">
      <el-button icon="el-icon-refresh-right" @click="refreshTableData"
        >刷新</el-button
      >
    </div>
    <div class="h-[300px]">
      <el-table height="100%" size="small" :data="tableData" :border="true">
        <el-table-column
          prop="ts"
          label="事件时间"
          width="90"
          :formatter="tsFormatter"
        />
        <el-table-column prop="flowType" label="类型" width="60" />
        <el-table-column prop="msg.id" label="消息ID" width="130">
          <template #default="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.msg.id"
              placement="top"
            >
              {{
                scope.row.msg.id.length > 14
                  ? scope.row.msg.id.substring(0, 14) + '...'
                  : scope.row.msg.id
              }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="msg.type" label="消息类型" width="130">
          <template #default="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.msg.type"
              placement="top"
            >
              {{
                scope.row.msg.type.length > 10
                  ? scope.row.msg.type.substring(0, 10) + '...'
                  : scope.row.msg.type
              }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="relationType" label="关系类型" width="90" />
        <el-table-column prop="msg.data" label="数据" width="60" align="center">
          <template #default="scope">
            <el-tooltip effect="dark" content="查看" placement="top">
              <el-button
                icon="el-icon-more-filled"
                @click="showDataHandler(scope.row.msg)"
                :link="true"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="msg.metadata"
          label="元数据"
          width="60"
          align="center"
        >
          <template #default="scope">
            <el-tooltip effect="dark" content="查看" placement="top">
              <el-button
                icon="el-icon-more-filled"
                @click="showMetadataHandler(scope.row.msg)"
                :link="true"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="err" label="错误" width="80">
          <template #default="scope">
            <el-tooltip
              v-if="scope.row.err"
              effect="dark"
              content="查看"
              placement="top"
            >
              <el-button
                v-if="scope.row.err"
                icon="el-icon-more-filled"
                @click="showErrorHandler(scope.row.err)"
                :link="true"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex justify-end pt-2">
      <el-pagination
        v-model:current-page="paginationState.page"
        v-model:page-size="paginationState.size"
        size="small"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="paginationState.pageSizes"
        :total="paginationState.total"
        :background="true"
        @change="paginationChangeHandler"
      ></el-pagination>
    </div>
    <el-dialog
      :append-to-body="false"
      :destroy-on-close="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :draggable="true"
      top="10px"
      :before-close="closeDialog"
      v-model="isDialogOpen"
      :title="dialogTitle"
    >
      <json-editor v-model="dialogData"></json-editor>
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="closeDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
