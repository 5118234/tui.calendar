import { h } from 'preact';

import { Week as WeekComponent } from '@src/components/view/week';
import CalendarControl from '@src/factory/calendarControl';

import type { Options } from '@t/options';

export default class Week extends CalendarControl {
  constructor(container: Element, options: Options = {}) {
    super(container, options);

    this.render();
  }

  protected getComponent() {
    return <WeekComponent />;
  }
}
