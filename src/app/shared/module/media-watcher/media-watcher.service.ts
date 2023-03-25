import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map, Observable, of, ReplaySubject, switchMap } from 'rxjs';
import { fromPairs } from 'lodash';

@Injectable()
export class FuseMediaWatcherService {

  breakPoints = {
    screens: {
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1440px',
    },
  }

  private _onMediaChange: ReplaySubject<{
    matchingAliases: string[];
    matchingQueries: any;
  }> = new ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }>(1);

  /**
   * Constructor
   */
  constructor(
    private _breakpointObserver: BreakpointObserver,
  ) {
    of(this.breakPoints).pipe(
      map(config =>
        fromPairs(
          Object.entries(config.screens).map(([alias, screen]) => [
            alias,
            `(min-width: ${screen})`,
          ])
        )
      ),
      switchMap((screens: any) =>
        this._breakpointObserver.observe(Object.values(screens)).pipe(
          map(state => {
            // Prepare the observable values and set their defaults
            const matchingAliases: string[] = [];
            const matchingQueries: any = {};

            // Get the matching breakpoints and use them to fill the subject
            const matchingBreakpoints = Object.entries(state.breakpoints).filter(([query, matches]) => matches) ?? [];
            for (const [query] of matchingBreakpoints) {
              // Find the alias of the matching query
              let entries: any = Object.entries(screens) || [];
              const matchingAlias = entries.find(([_alias, q]: [any, any]) => q === query)[0];

              // Add the matching query to the observable values
              if (matchingAlias) {
                matchingAliases.push(matchingAlias);
                matchingQueries[matchingAlias] = query;
              }
            }

            // Execute the observable
            this._onMediaChange.next({
              matchingAliases,
              matchingQueries,
            });
          })
        )
      )
    )
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for _onMediaChange
   */
  get onMediaChange$(): Observable<{
    matchingAliases: string[];
    matchingQueries: any;
  }> {
    return this._onMediaChange.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On media query change
   *
   * @param query
   */
  onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this._breakpointObserver.observe(query);
  }
}
