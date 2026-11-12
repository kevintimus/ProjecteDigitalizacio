import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import { DataService } from './core/data.service';
import { APP_INITIALIZER } from '@angular/core';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),{
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: (datos: DataService) => () => datos.cargarDatosIniciales(),
    deps: [DataService],
  }, ],
};
