import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule, MatToolbarModule,
  MatTooltipModule, MatProgressBarModule, MatSlideToggleModule, MatDialogModule, MatMenuModule, MatSliderModule,
  MatTabsModule, MatCheckboxModule, MatRadioModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatTableModule,
  MatSortModule, MatPaginatorModule, MatSnackBarModule, MatGridListModule, MatButtonToggleModule, MatProgressSpinnerModule,
  MatFormFieldModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatDividerModule,
  MatExpansionModule,
  MatRippleModule,
  MatStepperModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  imports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Material Modules
    MatGridListModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSliderModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    CdkTableModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatExpansionModule,
    MatRippleModule,
    MatStepperModule,
    // Chart module
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    // custom ProgressSpinnerModule
  ],
  exports: [
    // Angular Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Material Modules
    MatGridListModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSliderModule,
    MatSliderModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    // Chart module
    MatButtonToggleModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatExpansionModule,
    MatRippleModule,
    MatStepperModule,
  ],
  declarations: [],
  providers: [
  ],
  entryComponents: []
})
export class CommonMaterialModule {
}
