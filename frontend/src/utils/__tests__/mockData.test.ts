import { generateMockIncidents, createNewIncidentId, mockUsers } from '../mockData';
import { type Incident } from '../../types';

describe('mockData utilities', () => {
  describe('mockUsers', () => {
    it('should contain exactly 2 users', () => {
      expect(mockUsers).toHaveLength(2);
    });

    it('should have users with required properties', () => {
      mockUsers.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('type');
        expect(user).toHaveProperty('avatar');
      });
    });

    it('should have one solicitante and one atendente', () => {
      const types = mockUsers.map(user => user.type);
      expect(types).toContain('solicitante');
      expect(types).toContain('atendente');
    });
  });

  describe('generateMockIncidents', () => {
    it('should generate default number of incidents (50)', () => {
      const incidents = generateMockIncidents();
      expect(incidents).toHaveLength(50);
    });

    it('should generate custom number of incidents', () => {
      const incidents = generateMockIncidents(10);
      expect(incidents).toHaveLength(10);
    });

    it('should generate incidents with required properties', () => {
      const incidents = generateMockIncidents(5);
      
      incidents.forEach(incident => {
        expect(incident).toHaveProperty('id');
        expect(incident).toHaveProperty('title');
        expect(incident).toHaveProperty('description');
        expect(incident).toHaveProperty('status');
        expect(incident).toHaveProperty('priority');
        expect(incident).toHaveProperty('createdAt');
        expect(incident).toHaveProperty('updatedAt');
        expect(incident).toHaveProperty('createdBy');
        expect(incident).toHaveProperty('comments');
        expect(incident).toHaveProperty('category');
        expect(incident).toHaveProperty('tags');
      });
    });

    it('should generate incidents with valid IDs in sequence', () => {
      const incidents = generateMockIncidents(3);
      expect(incidents[0].id).toBe('INC-0001');
      expect(incidents[1].id).toBe('INC-0002');
      expect(incidents[2].id).toBe('INC-0003');
    });

    it('should generate incidents with valid status values', () => {
      const incidents = generateMockIncidents(20);
      const validStatuses = ['Aberto', 'Em andamento', 'Resolvido', 'Cancelado'];
      
      incidents.forEach(incident => {
        expect(validStatuses).toContain(incident.status);
      });
    });

    it('should generate incidents with valid priority values', () => {
      const incidents = generateMockIncidents(20);
      const validPriorities = ['Baixa', 'Média', 'Alta', 'Crítica'];
      
      incidents.forEach(incident => {
        expect(validPriorities).toContain(incident.priority);
      });
    });

    it('should generate incidents with valid dates', () => {
      const incidents = generateMockIncidents(5);
      const now = new Date();
      
      incidents.forEach(incident => {
        expect(incident.createdAt).toBeInstanceOf(Date);
        expect(incident.updatedAt).toBeInstanceOf(Date);
        expect(incident.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
        expect(incident.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime());
      });
    });

    it('should generate incidents with valid creators', () => {
      const incidents = generateMockIncidents(10);
      
      incidents.forEach(incident => {
        expect(mockUsers).toContainEqual(incident.createdBy);
      });
    });

    it('should generate incidents with comments array', () => {
      const incidents = generateMockIncidents(5);
      
      incidents.forEach(incident => {
        expect(Array.isArray(incident.comments)).toBe(true);
        incident.comments.forEach(comment => {
          expect(comment).toHaveProperty('id');
          expect(comment).toHaveProperty('content');
          expect(comment).toHaveProperty('createdAt');
          expect(comment).toHaveProperty('author');
          expect(mockUsers).toContainEqual(comment.author);
        });
      });
    });
  });

  describe('createNewIncidentId', () => {
    it('should create ID based on existing incidents length', () => {
      const existingIncidents: Incident[] = generateMockIncidents(5);
      const newId = createNewIncidentId(existingIncidents);
      expect(newId).toBe('INC-0006');
    });

    it('should create first ID when no incidents exist', () => {
      const existingIncidents: Incident[] = [];
      const newId = createNewIncidentId(existingIncidents);
      expect(newId).toBe('INC-0001');
    });

    it('should pad ID with zeros correctly', () => {
      const existingIncidents: Incident[] = generateMockIncidents(99);
      const newId = createNewIncidentId(existingIncidents);
      expect(newId).toBe('INC-0100');
    });
  });
});
