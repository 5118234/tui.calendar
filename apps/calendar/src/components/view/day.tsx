import { FunctionComponent, h } from 'preact';

import DayNames from '@src/components/daygrid/dayNames';
import { useStore } from '@src/components/hooks/store';
import { useTheme } from '@src/components/hooks/theme';
import { Layout } from '@src/components/layout';
import Panel from '@src/components/panel';
import { DayGridEvents } from '@src/components/panelgrid/dayGridEvents';
import { ColumnInfo } from '@src/components/timegrid/columns';
import { TimeGrid } from '@src/components/timegrid/timegrid';
import TZDate from '@src/time/date';
import { toEndOfDay, toStartOfDay } from '@src/time/datetime';
import { getDayNames } from '@src/util/dayName';
import { getDayGridEvents } from '@src/util/gridHelper';

import type { DayGridEventType } from '@t/panel';

const dayNameHeight = 42;

const Day: FunctionComponent = () => {
  const {
    state: { template, options, dataStore, grid },
  } = useStore();
  const theme = useTheme();

  if (!template || !theme || !options || !dataStore || !grid) {
    return null;
  }

  const { narrowWeekend, hourStart, hourEnd } = options.week;
  // @TODO: calculate based on today(need to calculate date when prev & next used)
  const cells = [new TZDate()];
  const dayNames = getDayNames(cells);
  const dayGridEvents = getDayGridEvents(cells, dataStore, { narrowWeekend, hourStart, hourEnd });
  const columnInfoList = cells.map(
    (cell) =>
      ({ start: toStartOfDay(cell), end: toEndOfDay(cell), unit: 'minute', slot: 30 } as ColumnInfo)
  );
  const allDayPanels = Object.entries(grid).map(([key, value]) => {
    const panelType = key as DayGridEventType;

    return (
      <Panel key={panelType} name={panelType} resizable>
        <DayGridEvents
          events={dayGridEvents[panelType]}
          cells={cells}
          type={panelType}
          height={value.height}
          options={options.week}
        />
      </Panel>
    );
  });

  return (
    <Layout>
      <Panel name="day-daynames" height={dayNameHeight}>
        <DayNames dayNames={dayNames} marginLeft={120} templateType="weekDayname" />
      </Panel>
      {allDayPanels}
      <Panel name="time" autoSize={1}>
        <TimeGrid events={dayGridEvents.time} columnInfoList={columnInfoList} />
      </Panel>
    </Layout>
  );
};

export default Day;
