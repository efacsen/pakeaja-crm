// This is a basic widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:pakeaja_crm/main.dart';

void main() {
  testWidgets('App launches and shows home screen', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: PakeAjaCRMApp(),
      ),
    );

    // Verify that the app title is shown
    expect(find.text('PakeAja CRM'), findsOneWidget);
    expect(find.text('Field Sales Solution'), findsOneWidget);

    // Verify that feature cards are displayed
    expect(find.text('Daily Reports'), findsOneWidget);
    expect(find.text('Canvassing'), findsOneWidget);
    expect(find.text('Materials'), findsOneWidget);

    // Tap the Daily Reports card and verify snackbar
    await tester.tap(find.text('Daily Reports'));
    await tester.pump();
    
    expect(find.text('Daily Reports feature coming soon!'), findsOneWidget);
  });
}