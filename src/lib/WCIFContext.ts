import type { Competition } from "@wca/helpers";
import { createContext } from "react";

export const WCIFContext = createContext<Competition>({
  formatVersion: '',
  id: 'Foo',
  name: 'Foo',
  shortName: 'Foo',
  persons: [],
  events: [],
  schedule: {
    startDate: '',
    numberOfDays: 0,
    venues: [],
  },
  competitorLimit: null,
  extensions: [],
});
