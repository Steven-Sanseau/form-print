<script setup>
import FieldChoice from "./FieldChoice.vue";
import FieldHeader from "./FieldHeader.vue";

defineProps({
  field: Object,
});
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 print-no-break">
    <FieldHeader :field="field" />
    <template v-if="field.type === 'group'">
      <div class="mt-4 space-y-3">
        <FormField
          v-for="field of field.properties.fields"
          :key="field.ref"
          :field="field"
        />
      </div>
    </template>
    <div v-else class="grid grid-flow-col auto-cols-fr gap-4 mt-3">
      <div class="space-y-2 empty:hidden">
        <template v-if="field.properties.choices">
          <FieldChoice
            v-for="choice of field.properties.choices"
            :key="choice.ref"
            :choice="choice"
          />
        </template>
        <template v-if="field.type === 'yes_no'">
          <FieldChoice :choice="{ label: 'Yes' }" />
          <FieldChoice :choice="{ label: 'No' }" />
        </template>
      </div>
      <pre
        class="text-xs text-muted-foreground overflow-x-auto print:whitespace-pre-wrap bg-muted p-3 rounded-md"
        v-html="field.logic"
      />
    </div>
  </div>
</template>
