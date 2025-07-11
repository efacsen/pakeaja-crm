import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import '../providers/canvassing_providers.dart';
import '../providers/canvassing_state.dart';
import '../widgets/company_info_step.dart';
import '../widgets/contact_potential_step.dart';
import '../widgets/photos_notes_step.dart';
import '../widgets/review_step.dart';

class QuickCanvassingScreen extends ConsumerStatefulWidget {
  const QuickCanvassingScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<QuickCanvassingScreen> createState() => _QuickCanvassingScreenState();
}

class _QuickCanvassingScreenState extends ConsumerState<QuickCanvassingScreen> {
  Timer? _timer;
  
  @override
  void initState() {
    super.initState();
    // Reset state when entering screen
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(canvassingStateProvider.notifier).reset();
      ref.read(canvassingStateProvider.notifier).captureLocation();
    });
    
    // Start timer for elapsed time display
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() {}); // Refresh UI to update timer
    });
  }
  
  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(canvassingStateProvider);
    final notifier = ref.read(canvassingStateProvider.notifier);
    
    return WillPopScope(
      onWillPop: () async {
        // Confirm exit if data entered
        if (state.companyName.isNotEmpty || state.contacts.isNotEmpty) {
          final shouldExit = await showDialog<bool>(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Discard changes?'),
              content: const Text('You have unsaved data. Are you sure you want to exit?'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  child: const Text('Discard'),
                ),
              ],
            ),
          );
          return shouldExit ?? false;
        }
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Quick Canvassing'),
          actions: [
            _buildTimer(state),
          ],
        ),
        body: Column(
          children: [
            _buildProgressIndicator(state),
            if (state.error != null)
              Container(
                color: Colors.red.shade100,
                padding: const EdgeInsets.all(8),
                child: Row(
                  children: [
                    const Icon(Icons.error, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        state.error!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => ref.read(canvassingStateProvider.notifier)
                          .state = state.copyWith(error: null),
                    ),
                  ],
                ),
              ),
            Expanded(
              child: _buildCurrentStep(state, notifier),
            ),
            _buildNavigationButtons(state, notifier),
          ],
        ),
      ),
    );
  }
  
  Widget _buildTimer(CanvassingState state) {
    final elapsed = state.elapsedTime;
    final minutes = elapsed.inMinutes;
    final seconds = elapsed.inSeconds % 60;
    final timeString = '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
    
    return Container(
      margin: const EdgeInsets.only(right: 16),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: state.isUnder3Minutes ? Colors.green : Colors.orange,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Icon(
            Icons.timer,
            color: Colors.white,
            size: 20,
          ),
          const SizedBox(width: 4),
          Text(
            timeString,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildProgressIndicator(CanvassingState state) {
    final steps = CanvassingStep.values;
    final currentIndex = steps.indexOf(state.currentStep);
    
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: List.generate(steps.length, (index) {
          final isActive = index <= currentIndex;
          final isCompleted = index < currentIndex;
          
          return Expanded(
            child: Row(
              children: [
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isActive
                        ? Theme.of(context).primaryColor
                        : Colors.grey.shade300,
                  ),
                  child: Center(
                    child: isCompleted
                        ? const Icon(Icons.check, color: Colors.white, size: 16)
                        : Text(
                            '${index + 1}',
                            style: TextStyle(
                              color: isActive ? Colors.white : Colors.grey.shade600,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
                if (index < steps.length - 1)
                  Expanded(
                    child: Container(
                      height: 2,
                      color: isCompleted
                          ? Theme.of(context).primaryColor
                          : Colors.grey.shade300,
                    ),
                  ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
  
  Widget _buildCurrentStep(CanvassingState state, CanvassingStateNotifier notifier) {
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    
    switch (state.currentStep) {
      case CanvassingStep.companyInfo:
        return CompanyInfoStep(state: state, notifier: notifier);
      case CanvassingStep.contactAndPotential:
        return ContactPotentialStep(state: state, notifier: notifier);
      case CanvassingStep.photosAndNotes:
        return PhotosNotesStep(state: state, notifier: notifier);
      case CanvassingStep.review:
        return ReviewStep(state: state, notifier: notifier);
    }
  }
  
  Widget _buildNavigationButtons(CanvassingState state, CanvassingStateNotifier notifier) {
    final isFirstStep = state.currentStep == CanvassingStep.companyInfo;
    final isLastStep = state.currentStep == CanvassingStep.review;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          if (!isFirstStep)
            Expanded(
              child: OutlinedButton.icon(
                onPressed: state.isLoading ? null : () => notifier.previousStep(),
                icon: const Icon(Icons.arrow_back),
                label: const Text('Previous'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.all(16),
                ),
              ),
            ),
          if (!isFirstStep) const SizedBox(width: 16),
          Expanded(
            flex: isFirstStep ? 1 : 2,
            child: ElevatedButton.icon(
              onPressed: state.isLoading
                  ? null
                  : () {
                      if (isLastStep) {
                        _handleSubmit(context, notifier);
                      } else {
                        notifier.nextStep();
                      }
                    },
              icon: Icon(isLastStep ? Icons.save : Icons.arrow_forward),
              label: Text(isLastStep ? 'Save Prospect' : 'Next'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
                backgroundColor: isLastStep && state.isUnder3Minutes
                    ? Colors.green
                    : Theme.of(context).primaryColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Future<void> _handleSubmit(BuildContext context, CanvassingStateNotifier notifier) async {
    await notifier.submit();
    
    final state = ref.read(canvassingStateProvider);
    if (state.error == null) {
      // Success
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Prospect saved successfully! ${state.isUnder3Minutes ? "Great job - under 3 minutes! 🚀" : ""}',
          ),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.of(context).pop();
    }
  }
}